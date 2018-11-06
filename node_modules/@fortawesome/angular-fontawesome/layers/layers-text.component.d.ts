import { Text, TextParams, SizeProp, FlipProp, PullProp, Transform, RotateProp } from '@fortawesome/fontawesome-svg-core';
import { FaLayersTextBaseComponent } from './layers-text-base.component';
/**
 * Fontawesome layers text.
 */
export declare class FaLayersTextComponent extends FaLayersTextBaseComponent {
    spin?: boolean;
    pulse?: boolean;
    flip?: FlipProp;
    size?: SizeProp;
    pull?: PullProp;
    border?: boolean;
    inverse?: boolean;
    listItem?: boolean;
    rotate?: RotateProp;
    fixedWidth?: boolean;
    transform?: string | Transform;
    /**
     * Updating params by component props.
     */
    protected updateParams(): void;
    protected renderFontawesomeObject(content: string, params?: TextParams): Text;
}
