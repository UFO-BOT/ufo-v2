import Client from "@/structures/Client";
import MongoDB from "@/structures/MongoDB";
import Constants from "@/types/Constants";
import constants from "@/properties/constants.json"
import Manager from "@/structures/Manager";

export default abstract class Base {
    client: Client = global.client
    manager: Manager = global.manager
    db: MongoDB = global.db
    constants: Constants = constants as Constants
}