import fastify from "fastify";
import cors from '@fastify/cors'
import { createTrip } from "./routes/create-trip";
import { validatorCompiler, serializerCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivity } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-link";
import { getLinks } from "./routes/get-links";

const app = fastify()

app.register(cors, {
  origin: true,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipants)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)

const port = 3333

app.listen({ port }).then(() => {
  console.log(`Server is running on port -> ${port}`)
})