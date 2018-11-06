import { Counter, CounterParams } from '@fortawesome/fontawesome-svg-core';
import { FaLayersTextBaseComponent } from './layers-text-base.component';
/**
 * Fontawesome layers counter.
 */
export declare class FaLayersCounterComponent extends FaLayersTextBaseComponent {
    /**
     * Updating params by component props.
     */
    protected updateParams(): void;
    protected renderFontawesomeObject(content: string | number, params?: CounterParams): Counter;
}
