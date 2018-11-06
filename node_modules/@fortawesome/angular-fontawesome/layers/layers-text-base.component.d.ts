import { OnChanges, SimpleChanges } from '@angular/core';
import { Styles, FontawesomeObject, TextParams } from '@fortawesome/fontawesome-svg-core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FaLayersComponent } from './layers.component';
export declare abstract class FaLayersTextBaseComponent implements OnChanges {
    private parent;
    private sanitizer;
    renderedHTML: SafeHtml;
    constructor(parent: FaLayersComponent, sanitizer: DomSanitizer);
    protected params: TextParams;
    protected content: string;
    protected title?: string;
    protected styles?: Styles;
    protected classes?: string[];
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Updating params by component props.
     */
    protected abstract updateParams(): void;
    /**
     * Render the FontawesomeObject using the content and params.
     */
    protected abstract renderFontawesomeObject(content: string | number, params?: TextParams): FontawesomeObject;
    /**
     * Updating content by params and content.
     */
    private updateContent;
}
