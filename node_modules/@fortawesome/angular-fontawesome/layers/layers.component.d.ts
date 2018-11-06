import { SimpleChanges, OnChanges, OnInit } from '@angular/core';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
/**
 * Fontawesome layers.
 */
export declare class FaLayersComponent implements OnInit, OnChanges {
    size?: SizeProp;
    fixedWidth?: boolean;
    hostClass: string;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    updateClasses(): void;
}
