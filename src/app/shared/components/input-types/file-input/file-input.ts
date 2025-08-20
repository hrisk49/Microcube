import {Component, computed, input, output, signal} from '@angular/core';
import {NgClass, NgIf, NgFor} from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
	selector: 'lds-file',
	imports: [
		NgClass,
		NgIf,
		NgFor,
		MatTooltipModule
	],
	templateUrl: './file-input.html',
	standalone: true,
	styleUrl: './file-input.scss'
})
export class FileComponent {

	// Optional form inputs to support required indicator
	readonly frmGroup = input<FormGroup>();
	readonly controlName = input<string>();

	// Inputs
	readonly id = input<string>('');
	readonly multipleFile = input<boolean>(false);
	readonly fileExtension = input<string>('*/*');
	readonly labelText = input<string>('Upload Files');
	readonly cssClass = input<string>('');
	readonly styles = input<string>('');
	readonly savePath = input<string>('');
	readonly customFileName = input<string>('');
	readonly visible = input<boolean>(true);
	readonly enable = input<boolean>(true);
	readonly tooltip = input<string>('');

	// Outputs
	readonly selectedFilesChanged = output<File[]>();
	readonly onFileChanged = output<any>();

	// Internal state
	selectedFiles = signal<File[]>([]);
	isDragOver = signal<boolean>(false);
	fileNamesDisplay = computed(() => {
		const files = this.selectedFiles();
		return files && files.length > 0 ? files.map(f => f.name).join(', ') : 'Choose file...';
	});

	isRequired(): boolean {
		const group = this.frmGroup();
		const name = this.controlName();
		if (!group || !name) return false;
		const control = group.get(name);
		if (!control?.validator) return false;
		const validation = control.validator({} as any);
		return !!validation?.['required'];
	}

	disabled = computed(() => !this.enable());
	containerClasses = computed(() => {
		const base = 'file-container';
		const custom = this.cssClass() || '';
		const visibility = this.visible() ? '' : 'hidden';
		return `${base} ${custom} ${visibility}`.trim();
	});

	acceptAttr(): string | null {
		const accept = this.fileExtension();
		return accept && accept.length > 0 ? accept : null;
	}
	onFileInputChange(event: Event) {
		const inputEl = event.target as HTMLInputElement;
		const files = inputEl.files ? Array.from(inputEl.files) : [];
		this.selectedFiles.set(files);
		this.selectedFilesChanged.emit(files);
		this.onFileChanged.emit({ files, savePath: this.savePath(), customFileName: this.customFileName() });
	}

	onDrop(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
		if (!event.dataTransfer) return;
		let files = Array.from(event.dataTransfer.files || []);
		if (!this.multipleFile() && files.length > 1) {
			files = files.slice(0, 1);
		}
		this.selectedFiles.set(files);
		this.selectedFilesChanged.emit(files);
		this.onFileChanged.emit({ files, savePath: this.savePath(), customFileName: this.customFileName() });
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(true);
	}

	onDragLeave(event: DragEvent) {
		event.preventDefault();
		this.isDragOver.set(false);
	}
}



