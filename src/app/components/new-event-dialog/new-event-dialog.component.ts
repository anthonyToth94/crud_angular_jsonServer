import { Component, OnInit } from '@angular/core';

//Kiegészítk
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-event-dialog',
  templateUrl: './new-event-dialog.component.html',
  styleUrls: ['./new-event-dialog.component.scss']
})
export class NewEventDialogComponent implements OnInit {
  eventForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<NewEventDialogComponent>) {
    this.eventForm = this.formBuilder.group({
      eventName: ['', Validators.required],
      backgroundColor: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = {
        title: this.eventForm.value.eventName,
        backgroundColor: this.eventForm.value.backgroundColor
      };

      this.dialogRef.close(eventData);
      //this.eventForm.reset();
    }
  }

  backEvent(): void {
    this.dialogRef.close();
  }


}
