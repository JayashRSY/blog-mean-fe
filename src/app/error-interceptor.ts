import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";

import { ErrorComponent } from "./shared/error/error.component";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private _dialog: MatDialog) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = "An unknown error has occurred"
                if(error.error.message) {
                    errorMessage = error.error.message
                }
                this._dialog.open(ErrorComponent, {data: {message: errorMessage}})
                return throwError(error);
            })
        )
    }
}