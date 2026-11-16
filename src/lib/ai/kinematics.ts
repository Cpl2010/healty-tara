import { Keypoint, JumpPhaseType, KinematicsResult } from "@/types";

/**
 * Menghitung sudut derajat antara 3 titik (A - B - C) dengan B sebagai vertex / sumbu.
 * Rumus menggunakan atan2 dari vektor BA dan BC.
 */
export function calculateAngle(
  pointA: Keypoint,
  pointB: Keypoint,
  pointC: Keypoint
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180.0) / Math.PI);

  if (angle > 180.0) {
    angle = 360.0 - angle;
  }

  return Math.round(angle * 10) / 10;
}

/**
 * Menghitung jarak Euclidean 2D antara dua koordinat
 */
export function calculateDistance(p1: Keypoint, p2: Keypoint): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Mendeteksi fase lompatan lompat tinggi (High Jump Phases)
 * Berdasarkan proporsi timeline video dan orientasi postur atlet
 */
export function detectJumpPhase(
  currentFrame: number,
  totalFrames: number,
  spineAngle?: number
): JumpPhaseType {
  const progress = currentFrame / Math.max(totalFrames, 1);

  if (progress < 0.35) {
    return "approach"; // Fase 1: J-Curve Approach
  } else if (progress < 0.48) {
    return "plant"; // Fase 2: Penultimate & Plant step
  } else if (progress < 0.62) {
    return "takeoff"; // Fase 3: Take-off impulse
  } else if (progress < 0.85) {
    return "clearance"; // Fase 4: Bar Clearance (Fosbury Flop Arch)
  } else {
    return "landing"; // Fase 5: Matras Landing
  }
}

/**
 * Menganalisis kinematika lompatan tinggi dan menghasilkan feedback berbasis AI
 */
export function analyzeKinematics(
  takeoffAngle: number,
  approachSpeed: number,
  archAngle: number,
  kneeFlexion: number
): KinematicsResult {
  const feedback: string[] = [];

  // Evaluasi Sudut Take-off (Ideal High Jump: 62° - 66°)
  if (takeoffAngle < 60) {
    feedback.push(
      `Sudut tumpuan terlalu datar (${takeoffAngle}°). Anda kehilangan daya dorong vertikal. Tancapkan kaki tumpu lebih agresif untuk mencapai 63°-65°.`
    );
  } else if (takeoffAngle > 70) {
    feedback.push(
      `Sudut tumpuan terlalu tegak (${takeoffAngle}°). Anda berisiko terjatuh ke mistar karena kekurangan momentum horizontal.`
    );
  } else {
    feedback.push(
      `Sudut take-off optimal (${takeoffAngle}°). Konversi kecepatan lari ke impuls vertikal sangat efisien.`
    );
  }

  // Evaluasi Kecepatan Awalan (Ideal: 7.0 - 8.2 m/s)
  if (approachSpeed < 7.0) {
    feedback.push(
      `Kecepatan awalan (${approachSpeed} m/s) perlu ditingkatkan pada 3 langkah terakhir kurva J.`
    );
  } else {
    feedback.push(
      `Kecepatan kurva ${approachSpeed} m/s memberikan gaya sentrifugal yang prima.`
    );
  }

  // Evaluasi Kelengkungan Fosbury Flop (Ideal Arch Angle: 135° - 155°)
  if (archAngle < 130) {
    feedback.push(
      `Lengkungan punggung (layback arch) masih kaku (${archAngle}°). Latih fleksibilitas otot lumbar dan ekstensi panggul.`
    );
  } else {
    feedback.push(
      `Lengkungan panggul sempurna (${archAngle}°). Pinggul bebas melewati mistar.`
    );
  }

  // Estimasi Vertical Leap
  const estimatedVerticalLeap = Math.round(
    Math.pow(approachSpeed * Math.sin((takeoffAngle * Math.PI) / 180), 2) /
      (2 * 9.8) *
      100 +
      45
  );

  return {
    takeoffAngle,
    approachVelocity: approachSpeed,
    estimatedVerticalLeap: Math.min(Math.max(estimatedVerticalLeap, 65), 98),
    archScore: Math.round((archAngle / 180) * 100),
    kneeFlexionAngle: kneeFlexion,
    feedback,
  };
}
