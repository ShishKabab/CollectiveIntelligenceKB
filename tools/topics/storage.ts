import { Topic } from "./types/topic";

export interface Storage {
    getTopic: (name : string) => Promise<Topic>
}
