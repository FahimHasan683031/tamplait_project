import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { PlanRoutes } from '../modules/plan/plan.routes';
import { SubscriptionRoutes } from '../modules/subscription/subscription.routes';
import { PackageRoutes } from '../modules/package/package.routes';
import { AlbumRoutes } from '../modules/album/album.route';
import { MediaRoutes } from '../modules/media/media.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { ReservationRoutes } from '../modules/reservation/reservation.routes';
import { RuleRoutes } from '../modules/rule/rule.route';
import { FaqRoutes } from '../modules/faq/faq.route';
import { ChatRoutes } from '../modules/chat/chat.routes';
import { MessageRoutes } from '../modules/message/message.routes';
import { BannerRoutes } from '../modules/banner/banner.routes';
import { ChecklistRoutes } from '../modules/checklist/checklist.route';
import { NoteRoutes } from '../modules/note/note.route';
import { ReminderRoutes } from '../modules/reminder/reminder.route';
import { BookmarkRoutes } from '../modules/bookmark/bookmark.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { NotificationRoutes } from '../modules/notification/notification.routes';
import { SupportRoutes } from '../modules/support/support.routes';
const router = express.Router();

const apiRoutes = [
    { path: "/user", route: UserRoutes },
    { path: "/auth", route: AuthRoutes },
    { path: "/plan", route: PlanRoutes },
    { path: "/subscription", route: SubscriptionRoutes },
    { path: "/package", route: PackageRoutes },
    { path: "/album", route: AlbumRoutes },
    { path: "/media", route: MediaRoutes },
    { path: "/category", route: CategoryRoutes },
    { path: "/reservation", route: ReservationRoutes },
    { path: "/rule", route: RuleRoutes },
    { path: "/faq", route: FaqRoutes },
    { path: "/chat", route: ChatRoutes },
    { path: "/message", route: MessageRoutes },
    { path: "/banner", route: BannerRoutes },
    { path: "/checklist", route: ChecklistRoutes },
    { path: "/note", route: NoteRoutes },
    { path: "/reminder", route: ReminderRoutes },
    { path: "/bookmark", route: BookmarkRoutes },
    { path: "/review", route: ReviewRoutes },
    { path: "/notification", route: NotificationRoutes },
    { path: "/support", route: SupportRoutes },
]

apiRoutes.forEach(route => router.use(route.path, route.route));
export default router;