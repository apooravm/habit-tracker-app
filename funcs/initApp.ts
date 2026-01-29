import { initDB } from "@/db/db";

export async function appStartup() {
    // await nukeDB();
    await initDB();
}
