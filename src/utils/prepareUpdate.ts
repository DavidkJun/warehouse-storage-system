import { encodePassword } from './bcrypt';

export async function prepareUpdateData<T extends object>(
  dto: T,
  fieldsToHash: Array<keyof T> = []
): Promise<Partial<T>> {
  const data: Partial<T> = { ...dto };

  for (const field of fieldsToHash) {
    if (data[field] && typeof data[field] === 'string') {
      data[field] = (await encodePassword(data[field] as string)) as any;
    }
  }

  Object.keys(data).forEach((key) => {
    if (data[key as keyof T] === undefined) {
      delete data[key as keyof T];
    }
  });

  return data;
}
