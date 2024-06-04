// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Observable, map } from 'rxjs';
// interface Res<T> {
//   data?: T;
//   message: string;
//   code: number;
//   success: boolean;
// }
// interface T {}

// @Injectable()
// export class CommonRes implements NestInterceptor {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Observable<any> | Promise<Observable<Res<T>>> {
//     return next.handle().pipe(
//       map((data) => ({
//         data,
//         success,
//         message,
//         code,
//       })),
//     );
//   }
// }
