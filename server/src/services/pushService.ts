/**
 * Server-Side Push Notification Dispatcher
 * Sends FCM / Expo Push Notifications to field reps and managers.
 */

export interface PushMessagePayload {
  toUserId: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  priority?: 'high' | 'normal';
}

export class PushNotificationService {
  public static async sendPush(payload: PushMessagePayload): Promise<boolean> {
    console.log(`[PUSH NOTIFICATION] Sending to User: ${payload.toUserId}`);
    console.log(`  Title: ${payload.title}`);
    console.log(`  Body: ${payload.body}`);
    // In production with Firebase Admin:
    // await admin.messaging().send({ token, notification: { title, body }, data });
    return true;
  }

  public static async notifyTourPlanApproval(mrUserId: string, month: string, asmName: string): Promise<boolean> {
    return this.sendPush({
      toUserId: mrUserId,
      title: 'Tour Plan Approved',
      body: `Your Tour Plan for ${month} has been approved by ${asmName}.`,
      priority: 'high',
      data: { type: 'TOUR_PLAN_APPROVED', month }
    });
  }

  public static async notifyGeofenceViolation(mrUserId: string, doctorName: string, distanceMeters: number): Promise<boolean> {
    return this.sendPush({
      toUserId: mrUserId,
      title: 'Geofence Alert',
      body: `Check-in for ${doctorName} was ${distanceMeters}m outside the designated clinic perimeter.`,
      priority: 'high',
      data: { type: 'GEOFENCE_ALERT', doctorName, distanceMeters }
    });
  }
}