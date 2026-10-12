import { app } from "./interface/http/app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.info(`CUBIX API disponible en http://localhost:${env.port}`);
});
