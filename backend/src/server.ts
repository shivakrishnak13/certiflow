import { createApp } from "@/app";
import envConfig from "@/utils/configuration/environment";
import { connectDB } from "@/config/db";

async function bootstrap() {
  try {
    const app = createApp();
    await connectDB();

    app.listen(envConfig.PORT, () =>
      console.info(`API running on localhost:${envConfig.PORT}`),
    );
  } catch (err) {
    console.error(err, "Error in Server File");
  }
}

bootstrap();
