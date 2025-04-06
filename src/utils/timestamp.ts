/**
 * Returns a date that is the sum of the current date and the number of seconds
 * provided.
 *
 * @param seconds - The number of seconds to add to the current date
 * @returns The date that is the sum of the current date and the number of seconds provided
 */
export function timestamp(seconds: number, { now }: { now?: Date } = {}): Date {
	const date = now ?? new Date();

	return new Date(date.getTime() + seconds * 1000);
}
