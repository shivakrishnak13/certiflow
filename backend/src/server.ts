import { createApp } from "@/app";

async function bootstrap() {
  try {
    const app = createApp();

    app.listen(8080, () => console.info(`API running on localhost:8080`));
  } catch (err) {
    console.error(err, "Error in Server File");
  }
}

bootstrap();
