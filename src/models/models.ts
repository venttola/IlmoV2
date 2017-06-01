import { Discount } from "./discount";
import { Event } from "./event";
import { GroupPayment } from "./grouppayment";
import { Organization } from "./organization";
import { ParticipantGroup } from "./participantgroup";
import { Platoon } from "./platoon";
import { Product } from "./product";
import { ProductSelection } from "./productselection";
import { User } from "./user";
import { UserPayment } from "./userpayment";
import { NonregisteredParticipant } from "./nonregistered-participant";
/*declare module "Models" {
	import function Organization();
	import function	ParticipantGroup();
	import function	Platoon();
	import function Product();
	import function	ProductSelection();
	import function	User();
	import function	UserPayment();
}*/

export function defineModels(db: any) {
	Discount(db);
	Event(db);
	GroupPayment(db);
	Organization(db);
	ParticipantGroup(db);
	Platoon(db);
	Product(db);
	ProductSelection(db);
	User(db);
	UserPayment(db);
	NonregisteredParticipant(db);
};