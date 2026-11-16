// ==========================================
// 1. ATHLETE & PROFILE INTERFACES
// ==========================================
export interface Athlete {
  id: string;
  user_id: string;
  full_name: string;
  category?: string;
  club?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Profile extends Athlete {
  weight_kg?: number;
  height_cm?: number;
  personal_best_m?: number;
}

// ==========================================
// 2. BIOMECHANICS & KINEMATICS INTERFACES
// ==========================================
export type JumpPhaseType =
  | "approach" // Awalan lari J-Curve
  | "plant" // Penultimate & Plant Step (Kaki tumpuan)
  | "takeoff" // Pelepasan tumpuan (Take-off impulse)
  | "clearance" // Melengkung melewati mistar (Fosbury Flop Arch)
  | "landing"; // Pendaratan di matras

export interface Keypoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
  name?: string;
}

export interface PoseLandmark {
  nose: Keypoint;
  leftShoulder: Keypoint;
  rightShoulder: Keypoint;
  leftElbow: Keypoint;
  rightElbow: Keypoint;
  leftWrist: Keypoint;
  rightWrist: Keypoint;
  leftHip: Keypoint;
  rightHip: Keypoint;
  leftKnee: Keypoint;
  rightKnee: Keypoint;
  leftAnkle: Keypoint;
  rightAnkle: Keypoint;
  leftHeel?: Keypoint;
  rightHeel?: Keypoint;
}

export interface BiomechanicsData {
  id?: string;
  user_id?: string;
  session_date: string;
  video_url?: string;
  vertical_leap_cm: number;
  takeoff_angle_deg: number;
  approach_speed_ms: number;
  knee_flexion_deg: number;
  hip_extension_deg: number;
  arch_angle_deg: number;
  phase: JumpPhaseType;
  ai_recommendation: string;
  created_at?: string;
}

export interface KinematicsResult {
  takeoffAngle: number;
  approachVelocity: number;
  estimatedVerticalLeap: number;
  archScore: number;
  kneeFlexionAngle: number;
  feedback: string[];
}

// ==========================================
// 3. WORKOUTS INTERFACES
// ==========================================
export interface Workout {
  id: string;
  user_id: string;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  jump_height?: number;
  notes?: string;
  created_at: string;
}

export interface WorkoutInput {
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  jump_height?: number;
  notes?: string;
}

// ==========================================
// 4. NUTRITION & TDEE INTERFACES
// ==========================================
export interface NutritionLog {
  id: string;
  user_id: string;
  meal_time: string;
  food_name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  created_at: string;
}

export interface TdeeResult {
  bmr: number;
  tdee: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

// ==========================================
// 5. COMPARISON & GHOST OVERLAY
// ==========================================
export interface ComparisonAttempt {
  id: string;
  title: string;
  athlete_name: string;
  height_m: number;
  takeoff_angle: number;
  speed_ms: number;
  video_src?: string;
  keypoints?: PoseLandmark;
}

export interface GhostOverlayConfig {
  opacity: number;
  showSkeletonA: boolean;
  showSkeletonB: boolean;
  syncByPhase: boolean;
  targetPhase: JumpPhaseType;
}
