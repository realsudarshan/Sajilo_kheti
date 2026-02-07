import { createTRPCReact } from '@trpc/react-query';
// Path points to your backend index.ts
import type { AppRouter } from '../../express-trpc/src/server/index';

export const trpc = createTRPCReact<AppRouter>();