export class Classroom {
  // TODO - ID should be generated for the QR, should be unique for the whole base
  // QR can be a combo of prof and subject ID
  $key?: string;

  // TODO - delete this later, professor ID:
  // professor KEY (google account)
  owner?: string;
  code?: string;

  // added fields:
  // TODO - name should be unique for the professor:
  name: string;
  content: string; // dodatne info ako će zapisati
  active = true; // to "delete" or not show
  timeStamp: number; // when it was made

  // student = id, name (results, points, ...)
  
  students: Student[];
  // subject = id, name (reference to the prof's subject)
}

// TODO - connect students over the ID that they will get (based on the device #)
export class Student {
  key?: string;
  name: string;
  active?: true;
  points?: number;

  //points = 0;
  //active = true;
}