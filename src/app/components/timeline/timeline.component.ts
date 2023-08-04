import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NewEventDialogComponent } from '../new-event-dialog/new-event-dialog.component';
@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent {
  timelineForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewEventDialogComponent>) {
    this.timelineForm = this.formBuilder.group({
      title: ['', Validators.required],
      backgroundColor: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.timelineForm.valid) {
      const eventData = {
        title: this.timelineForm.value.title,
        backgroundColor: this.timelineForm.value.backgroundColor
      };

      this.dialogRef.close(eventData);
      //this.timelineForm.reset();
    }
  }

  backEvent(): void {
    this.dialogRef.close();
  }

}