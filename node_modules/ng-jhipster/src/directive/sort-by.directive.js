import { Directive, Host, HostListener, Input, ElementRef, Renderer } from '@angular/core';
import { JhiSortDirective } from './sort.directive';
import { JhiConfigService } from '../config.service';
var JhiSortByDirective = /** @class */ (function () {
    function JhiSortByDirective(jhiSort, el, renderer, configService) {
        this.el = el;
        this.renderer = renderer;
        this.sortAscIcon = 'fa-sort-up';
        this.sortDescIcon = 'fa-sort-down';
        this.jhiSort = jhiSort;
        var config = configService.getConfig();
        this.sortAscIcon = config.sortAscIcon;
        this.sortDescIcon = config.sortDescIcon;
    }
    JhiSortByDirective.prototype.ngAfterViewInit = function () {
        if (this.jhiSort.predicate && this.jhiSort.predicate !== '_score' && this.jhiSort.predicate === this.jhiSortBy) {
            this.applyClass();
        }
    };
    JhiSortByDirective.prototype.onClick = function () {
        if (this.jhiSort.predicate && this.jhiSort.predicate !== '_score') {
            this.jhiSort.sort(this.jhiSortBy);
            this.applyClass();
        }
    };
    JhiSortByDirective.prototype.applyClass = function () {
        var childSpan = this.el.nativeElement.children[1];
        var add = this.sortAscIcon;
        if (!this.jhiSort.ascending) {
            add = this.sortDescIcon;
        }
        this.renderer.setElementClass(childSpan, add, true);
    };
    ;
    JhiSortByDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[jhiSortBy]'
                },] },
    ];
    /** @nocollapse */
    JhiSortByDirective.ctorParameters = function () { return [
        { type: JhiSortDirective, decorators: [{ type: Host },] },
        { type: ElementRef, },
        { type: Renderer, },
        { type: JhiConfigService, },
    ]; };
    JhiSortByDirective.propDecorators = {
        "jhiSortBy": [{ type: Input },],
        "onClick": [{ type: HostListener, args: ['click',] },],
    };
    return JhiSortByDirective;
}());
export { JhiSortByDirective };
