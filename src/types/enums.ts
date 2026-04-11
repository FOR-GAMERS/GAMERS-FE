/**
 * GAMERS Backend — Enum Type Specification
 * Synchronized with BE string-based constants.
 */

// 1. GameType
export const GameType = {
  VALORANT: "VALORANT",
  LOL: "LOL",
} as const;
export type GameType = typeof GameType[keyof typeof GameType];

// 2. ContestType
export const ContestType = {
  TOURNAMENT: "TOURNAMENT",
  LEAGUE: "LEAGUE",
  CASUAL: "CASUAL",
} as const;
export type ContestType = typeof ContestType[keyof typeof ContestType];

// 3. ContestStatus
export const ContestStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;
export type ContestStatus = typeof ContestStatus[keyof typeof ContestStatus];

// 4. GameStatus
export const GameStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;
export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

// 5. GameTeamType
export const GameTeamType = {
  SINGLE: "SINGLE",
  DUO: "DUO",
  TRIO: "TRIO",
  FULL: "FULL",
  HURUPA: "HURUPA",
} as const;
export type GameTeamType = typeof GameTeamType[keyof typeof GameTeamType];

// 6. DetectionStatus
export const DetectionStatus = {
  NONE: "NONE",
  DETECTING: "DETECTING",
  DETECTED: "DETECTED",
  FAILED: "FAILED",
  MANUAL: "MANUAL",
} as const;
export type DetectionStatus = typeof DetectionStatus[keyof typeof DetectionStatus];

// 7. UserRole
export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

// 8. MemberType
export const MemberType = {
  STAFF: "STAFF",
  NORMAL: "NORMAL",
} as const;
export type MemberType = typeof MemberType[keyof typeof MemberType];

// 9. LeaderType
export const LeaderType = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
} as const;
export type LeaderType = typeof LeaderType[keyof typeof LeaderType];

// 10. TeamMemberType
export const TeamMemberType = {
  LEADER: "LEADER",
  MEMBER: "MEMBER",
} as const;
export type TeamMemberType = typeof TeamMemberType[keyof typeof TeamMemberType];

// 11. ValorantRole
export const ValorantRole = {
  DUELIST: "DUELIST",
  INITIATOR: "INITIATOR",
  CONTROLLER: "CONTROLLER",
  SENTINEL: "SENTINEL",
} as const;
export type ValorantRole = typeof ValorantRole[keyof typeof ValorantRole];
export type ValorantRoles = ValorantRole[];

// 12. ApplicationStatus
export const ApplicationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
} as const;
export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

// 13. InviteStatus
export const InviteStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  EXPIRED: "EXPIRED",
} as const;
export type InviteStatus = typeof InviteStatus[keyof typeof InviteStatus];

// 14. LolMatchStatus
export const LolMatchStatus = {
  PENDING: "PENDING",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;
export type LolMatchStatus = typeof LolMatchStatus[keyof typeof LolMatchStatus];

// 15. LolMatchWinner
export const LolMatchWinner = {
  TEAM_A: "TEAM_A",
  TEAM_B: "TEAM_B",
} as const;
export type LolMatchWinner = typeof LolMatchWinner[keyof typeof LolMatchWinner];

// 16. LolSessionStatus
export const LolSessionStatus = {
  WAITING: "WAITING",
  BALANCING: "BALANCING",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;
export type LolSessionStatus = typeof LolSessionStatus[keyof typeof LolSessionStatus];
