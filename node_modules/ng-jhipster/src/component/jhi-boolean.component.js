import { Component, Input } from '@angular/core';
import { JhiConfigService } from '../config.service';
/**
 * This component can be used to display a boolean value by defining the @Input attributes
 * If an attribute is not provided, default values will be applied (see JhiModuleConfig class)
 * Have a look at the following examples
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * <jhi-boolean [value]="inputBooleanVariable"></jhi-boolean>
 *
 * - Display a green check when inputBooleanVariable is true
 * - Display a red cross when inputBooleanVariable is false
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * <jhi-boolean
 *     [value]="inputBooleanVariable">
 *     classTrue="fa fa-lg fa-check text-primary"
 *     classFalse="fa fa-lg fa-times text-warning"
 * </jhi-boolean>
 *
 * - Display a blue check when inputBooleanVariable is true
 * - Display an orange cross when inputBooleanVariable is false
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * <jhi-boolean
 *     [value]="inputBooleanVariable">
 *     classTrue="fa fa-lg fa-check"
 *     classFalse=""
 * </jhi-boolean>
 *
 * - Display a black check when inputBooleanVariable is true
 * - Do not display anything when inputBooleanVariable is false
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * <jhi-boolean
 *     [value]="inputBooleanVariable"
 *     [textTrue]="'userManagement.activated' | translate"
 *     textFalse="deactivated">
 * </jhi-boolean>
 *
 * - Display a green badge when inputBooleanVariable is true
 * - Display a red badge when inputBooleanVariable is false
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * <jhi-boolean
 *     [value]="user.activated"
 *     classTrue="badge badge-warning"
 *     classFalse="badge badge-info"
 *     [textTrue]="'userManagement.activated' | translate"
 *     textFalse="deactivated">
 * </jhi-boolean>
 *
 * - Display an orange badge and write 'activated' when inputBooleanVariable is true
 * - Display a blue badge and write 'deactivated' when inputBooleanVariable is false
 */
var JhiBooleanComponent = /** @class */ (function () {
    function JhiBooleanComponent(configService) {
        this.config = configService.getConfig();
    }
    JhiBooleanComponent.prototype.ngOnInit = function () {
        if (this.textTrue === undefined) {
            if (this.classTrue === undefined) {
                this.classTrue = this.config.classTrue;
            }
        }
        else {
            if (this.classTrue === undefined) {
                this.classTrue = this.config.classBadgeTrue;
            }
        }
        if (this.textFalse === undefined) {
            if (this.classFalse === undefined) {
                this.classFalse = this.config.classFalse;
            }
        }
        else {
            if (this.classFalse === undefined) {
                this.classFalse = this.config.classBadgeFalse;
            }
        }
    };
    JhiBooleanComponent.decorators = [
        { type: Component, args: [{
                    selector: 'jhi-boolean',
                    template: "<span\n               [ngClass]=\"value ? classTrue : classFalse\"\n               [innerHtml]=\"value ? textTrue : textFalse\">\n               </span>"
                },] },
    ];
    /** @nocollapse */
    JhiBooleanComponent.ctorParameters = function () { return [
        { type: JhiConfigService, },
    ]; };
    JhiBooleanComponent.propDecorators = {
        "value": [{ type: Input },],
        "classTrue": [{ type: Input },],
        "classFalse": [{ type: Input },],
        "textTrue": [{ type: Input },],
        "textFalse": [{ type: Input },],
    };
    return JhiBooleanComponent;
}());
export { JhiBooleanComponent };
