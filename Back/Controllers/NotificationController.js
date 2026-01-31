import Notification from "../Models/Notification.js";

export const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId, deleted: false })
      .sort({ createdAt: -1 })
      .limit(100);

    const unreadCount = await Notification.countDocuments({
      recipient: req.userId,
      read: false,
      deleted: false,
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error("getMyNotifications error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.userId },
      { read: true, read_at: new Date() },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    res.json({ notification: notif });
  } catch (error) {
    console.error("markNotificationRead error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, read: false, deleted: false },
      { read: true, read_at: new Date() }
    );
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    console.error("markAllNotificationsRead error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.userId, deleted: false },
      { deleted: true, deleted_at: new Date() },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    res.json({ notification: notif });
  } catch (error) {
    console.error("deleteNotification error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const restoreNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.userId, deleted: true },
      { deleted: false, deleted_at: null },
      { new: true }
    );
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    res.json({ notification: notif });
  } catch (error) {
    console.error("restoreNotification error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notification.findOne({
      _id: id,
      recipient: req.userId,
      deleted: false,
    });
    if (!notif) return res.status(404).json({ error: "Notification not found" });
    
    // Auto-mark as read when viewing
    if (!notif.read) {
      notif.read = true;
      notif.read_at = new Date();
      await notif.save();
    }
    
    res.json({ notification: notif });
  } catch (error) {
    console.error("getNotificationById error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

