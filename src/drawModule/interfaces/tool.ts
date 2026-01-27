import _ from 'paper';
import { DrawService } from '../service/drawService';

export interface ToolInterface {
    tool: paper.Tool | null;
    activate(drawService: DrawService): void;
    createTool(drawService: DrawService): void;
}

export interface ToolState{
    context: ToolInterface;

    nextState(): ToolState;

    onMouseDown(event: paper.ToolEvent, drawService: DrawService): void;

    onMouseDrag?(event: paper.ToolEvent, drawService: DrawService): void;

    onMouseMove(event: paper.ToolEvent, drawService: DrawService): void;
}