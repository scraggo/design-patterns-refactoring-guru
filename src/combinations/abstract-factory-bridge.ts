// Track is "Abstraction"
export class SoftwareInstrumentTrack {
  protected instrument: Instrument;

  constructor(instrument: Instrument) {
    this.instrument = instrument;
  }

  public addEvent(event: string): string {
    return event;
  }
}

export class NativeMIDITrack extends SoftwareInstrumentTrack {
  protected eventList: string[] = [];

  public addEvent(event: string): string {
    this.instrument.handleEventInput(event);
    this.eventList.push(event);
    return event;
  }
}

export class ThirdPartyMIDITrack extends SoftwareInstrumentTrack {
  public addEvent(event: string): string {
    this.instrument.handleEventInput(event);
    // add event to third party instrument's list
    // this.instrument.eventList.push(event);
    return event;
  }
}

// Instrument is "Implementation"
export interface Instrument {
  handleEventInput(event: string): string;
}

export class MIDIGuitar implements Instrument {
  public handleEventInput(event: string): string {
    event += 'patch:26';
    // use native player on event
    return event;
  }
}

export class MIDIBass implements Instrument {
  public handleEventInput(event: string): string {
    event += 'patch:32';
    // use native player on event
    return event;
  }
}

// this one doesn't use the same MIDI capabilities
export class DrumMachine implements Instrument {
  public eventList: string[] = [];
  public handleEventInput(event: string): string {
    this.eventList.push(event);
    return event;
  }
}

export function main() {
  const musicEditor: SoftwareInstrumentTrack[] = [];
  const guitar = new MIDIGuitar();
  const bass = new MIDIBass();
  const drums = new DrumMachine();

  // this will be abstract factory
  musicEditor.push(new NativeMIDITrack(guitar));
  musicEditor.push(new NativeMIDITrack(bass));
  musicEditor.push(new ThirdPartyMIDITrack(drums));

  musicEditor[0].addEvent('pitch:99,length:10');
}

export const name = 'Bridge';
