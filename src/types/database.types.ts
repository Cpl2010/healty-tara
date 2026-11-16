export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  athlete_category?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Workout {
  id: string;
  user_id: string;
  workout_type: string;
  duration_minutes: number;
  calories_burned: number;
  notes?: string;
  created_at: string;
}

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

export interface LeaderboardEntry {
  id: string;
  user_id?: string;
  athlete_name: string;
  region: string;
  club?: string;
  best_height_m: number;
  vertical_jump_cm: number;
  rank?: number;
  created_at?: string;
}

export interface JumpMetric {
  id: string;
  user_id: string;
  vertical_leap_cm: number;
  takeoff_angle_deg: number;
  approach_speed_ms: number;
  ai_recommendation: string;
  created_at: string;
}
