import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'})

class ActivityStore {
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined = undefined;
    @observable loadingInitial: boolean = false;
    @observable editMode: boolean = false;
    @observable submitting: boolean = false;
    @observable target: string = '';

    @computed get activitiesByDate() {
        return this.activities.slice().sort((a, b) =>
            Date.parse(a.date) -Date.parse(b.date))
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities',() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0];
                    this.activities.push(activity);
                });
                this.loadingInitial = false;
            })
            
        } catch (error) {
            runInAction('load activities error',() => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity',() => {
                this.activities.push(activity);
                this.editMode = false;
                this.submitting = false;
            })
            
        } catch (error) {
            runInAction('create activity error',() => {
                this.submitting = false;
            })
            console.log(error);
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction('editing activity', () => {
                this.activities = ([...this.activities.filter(a => a.id !== activity.id), activity]);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })
        } catch (error) {
            runInAction('edit activity error', () => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction('deleting activity', () => {
                this.activities = this.activities.filter(a => a.id !== id);
                this.submitting = false;
                this.target = '';
            })
        } catch (error) {
            runInAction('delete activity error', () => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
        
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activities.find(a => a.id === id)
        this.editMode = false;
    }

}

export default createContext(new ActivityStore())