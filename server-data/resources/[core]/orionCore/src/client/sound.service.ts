import {Injectable} from "../core/decorators";

@Injectable()
export class SoundService {
    public playAround(name: string, distance: number, duration: number) {
        TriggerServerEvent('InteractSound_SV:PlayWithinDistance', distance, name, duration);
    }

    public play(name: string, volume: number) {
        TriggerEvent('InteractSound_CL:PlayOnOne', name, volume);
    }
}