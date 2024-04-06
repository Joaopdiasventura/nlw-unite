export interface Message {
	message?: string;
}

export interface HttpResponse<T> {
	statusCode: number;
	body: T | Message;
}

export function verifyFields(fields: string[], dto: any) {
	if (!dto)
		return {
			statusCode: 400,
			body: { message: `Envie o corpo de uma solictação` },
		};
	for (const element of fields) {
		if (!dto[element])
			return {
				statusCode: 400,
				body: { message: `Campo ${element} faltando` },
			};
	}
}
