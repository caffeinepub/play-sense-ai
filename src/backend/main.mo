import MixinStorage "blob-storage/Mixin";
import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  include MixinStorage();

  type SessionId = Text;
  type PlanName = Text;

  // ----------- Rating Management -----------

  type Rating = {
    sessionId : SessionId;
    value : Nat; // 1-5
  };

  module Rating {
    public func compare(rating1 : Rating, rating2 : Rating) : Order.Order {
      Text.compare(rating1.sessionId, rating2.sessionId);
    };
  };

  var totalRatingValue = 0;
  var numRatings = 0;
  let ratingsMap = Map.empty<SessionId, Rating>();

  public shared ({ caller }) func submitRating(sessionId : SessionId, value : Nat) : async () {
    if (value < 1 or value > 5) { Runtime.trap("Rating value must be between 1 and 5") };

    switch (ratingsMap.get(sessionId)) {
      case (null) {
        // New rating
        let rating : Rating = {
          sessionId;
          value;
        };
        ratingsMap.add(sessionId, rating);
        totalRatingValue += value;
        numRatings += 1;
      };
      case (?existing) {
        // Update existing rating
        ratingsMap.add(sessionId, { existing with value });
        totalRatingValue := totalRatingValue + value - existing.value;
      };
    };
  };

  public query ({ caller }) func getRatingStats() : async {
    averageRating : Nat;
    numRatings : Nat;
  } {
    let average = if (numRatings == 0) { 0 } else {
      totalRatingValue / numRatings;
    };
    {
      averageRating = average;
      numRatings;
    };
  };

  // ------------- Daily Image Upload Limit -------------

  type DailyLimit = {
    count : Nat;
    lastDay : Time.Time;
  };

  let dailyLimitMap = Map.empty<SessionId, DailyLimit>();

  func isSameDay(time1 : Time.Time, time2 : Time.Time) : Bool {
    let nsInDay = 86_400_000_000_000;
    time1 / nsInDay == time2 / nsInDay;
  };

  type UploadResult = {
    allowed : Bool;
    count : Nat;
  };

  module UploadResult {
    public func compare(result1 : UploadResult, result2 : UploadResult) : Order.Order {
      Nat.compare(result1.count, result2.count);
    };
  };

  public shared ({ caller }) func canUploadImage(sessionId : SessionId) : async UploadResult {
    let currentTime = Time.now();
    let limit = switch (dailyLimitMap.get(sessionId)) {
      case (null) { { count = 0; lastDay = currentTime } };
      case (?existing) {
        if (isSameDay(existing.lastDay, currentTime)) {
          existing;
        } else {
          // New day, reset count
          { count = 0; lastDay = currentTime };
        };
      };
    };
    {
      allowed = (limit.count < 5);
      count = limit.count;
    };
  };

  public shared ({ caller }) func recordImageUpload(sessionId : SessionId) : async UploadResult {
    let currentTime = Time.now();
    let limit = switch (dailyLimitMap.get(sessionId)) {
      case (null) { { count = 0; lastDay = currentTime } };
      case (?existing) {
        if (isSameDay(existing.lastDay, currentTime)) {
          existing;
        } else {
          // New day, reset count
          { count = 0; lastDay = currentTime };
        };
      };
    };

    if (limit.count >= 5) {
      { allowed = false; count = limit.count };
    } else {
      let newLimit = {
        count = limit.count + 1;
        lastDay = currentTime;
      };
      dailyLimitMap.add(sessionId, newLimit);
      {
        allowed = true;
        count = newLimit.count;
      };
    };
  };

  // ----------- Subscription Records ------------

  type Subscription = {
    sessionId : SessionId;
    planName : PlanName;
    timestamp : Time.Time;
  };

  module Subscription {
    public func compare(sub1 : Subscription, sub2 : Subscription) : Order.Order {
      Text.compare(sub1.sessionId, sub2.sessionId);
    };
  };

  let allSubscriptions = List.empty<Subscription>();

  public shared ({ caller }) func recordSubscription(sessionId : SessionId, planName : PlanName) : async () {
    let newSub : Subscription = {
      sessionId;
      planName;
      timestamp = Time.now();
    };
    allSubscriptions.add(newSub);
  };

  public query ({ caller }) func getAllSubscriptions() : async [Subscription] {
    allSubscriptions.toArray().sort();
  };
};
