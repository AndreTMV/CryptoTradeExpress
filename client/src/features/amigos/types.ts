export interface FriendSummary {
  id: number;
  friend: string;
  is_mutual_friend: boolean;
}

export interface FriendRequestDTO {
  id: number;
  is_active: boolean;
  timestamp: string;
  sender: number;
  sender_username: string;
  receiver: number;
  receiver_username: string;
}

export type SimpleStatus = { status: string } | string | boolean;

export type AreFriendsResponse = { friends: boolean } | { status: string };
export type FriendRequestExistsResponse = { status: boolean } | { status: string };

// === Params / DTOs ===
export interface FetchFriendsDTO { user: number; see_user: number; }
export interface AreFriendsDTO { user: number; see_user: number; }
export interface RemoveFriendDTO { user: number; receiver_id: number; }
export interface SendFriendRequestDTO { user: number; receiver_user_id: number; }
export interface FriendRequestStatusDTO { user: number; receiver: number; }
export interface CancelFriendRequestDTO { user: number; receiver_id: number; }
export interface FetchFriendRequestsDTO { user: number; }
export interface AcceptDeclineDTO { user: number; friend_request: number; }

// === State ===
export interface FriendsState {
  friends: FriendSummary[];
  requests: FriendRequestDTO[];
  areFriends: boolean | null;
  requestExists: boolean | null;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string | null;
}
