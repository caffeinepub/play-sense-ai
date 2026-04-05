import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Subscription {
    timestamp: Time;
    sessionId: SessionId;
    planName: PlanName;
}
export type PlanName = string;
export type Time = bigint;
export type SessionId = string;
export interface UploadResult {
    count: bigint;
    allowed: boolean;
}
export interface backendInterface {
    canUploadImage(sessionId: SessionId): Promise<UploadResult>;
    getAllSubscriptions(): Promise<Array<Subscription>>;
    getRatingStats(): Promise<{
        averageRating: bigint;
        numRatings: bigint;
    }>;
    recordImageUpload(sessionId: SessionId): Promise<UploadResult>;
    recordSubscription(sessionId: SessionId, planName: PlanName): Promise<void>;
    submitRating(sessionId: SessionId, value: bigint): Promise<void>;
}
