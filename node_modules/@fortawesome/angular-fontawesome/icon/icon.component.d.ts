import { OnChanges, SimpleChanges } from '@angular/core';
import { Icon, Styles, PullProp, IconProp, SizeProp, FlipProp, FaSymbol, Transform, RotateProp } from '@fortawesome/fontawesome-svg-core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FaIconService } from './icon.service';
/**
 * Fontawesome icon.
 */
export declare class FaIconComponent implements OnChanges {
    private sanitizer;
    private iconService;
    iconProp: IconProp;
    title?: string;
    spin?: boolean;
    pulse?: boolean;
    mask?: IconProp;
    styles?: Styles;
    flip?: FlipProp;
    size?: SizeProp;
    pull?: PullProp;
    border?: boolean;
    inverse?: boolean;
    symbol?: FaSymbol;
    listItem?: boolean;
    rotate?: RotateProp;
    fixedWidth?: boolean;
    classes?: string[];
    transform?: string | Transform;
    icon: Icon;
    renderedIconHTML: SafeHtml;
    constructor(sanitizer: DomSanitizer, iconService: FaIconService);
    private params;
    private iconSpec;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Updating icon spec.
     */
    private updateIconSpec;
    /**
     * Updating params by component props.
     */
    private updateParams;
    /**
     * Updating icon by params and icon spec.
     */
    private updateIcon;
    /**
     * Rendering icon.
     */
    private renderIcon;
}
