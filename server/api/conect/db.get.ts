import { getQuery } from "h3";

export default defineEventHandler(async (event) => {
	const query = getQuery(event) as { celular?: string };
	const celular = query.celular;
    if (!celular) {
        return { status: "error", message: "Falta el parámetro 'celular'" };
    }

    const db = usePostgres();
    const ventas = await db`
      DELETE FROM usuario_vendedor
      WHERE id_persona IN (
        SELECT id_persona
        FROM personas
        WHERE celular = ${celular}
      )
        RETURNING *
    `;

	return { status: "success", data: ventas };
});
