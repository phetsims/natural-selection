# TODO list for natural-selection

## Feature Milestones

| Feature | Time Remaining | Completed |
| --- | :---: | ---: |
| Modes | 0 | 4/23/2020 |
| Mating | 0 | 4/30/2020 |
| Mutations | 0 | 4/30/2020 |
| Intro screen | 0 | 5/7/2020 |
| Pedigree graph | 0 | 5/11/2020 |
| query parameters | 0 | 5/18/2020 |
| Proportions graph | 0 | 5/26/2020 | 
| Population graph | 3 weeks | |
| Food | 2 weeks | | 
| Wolves | 2 weeks | |
| Data pruning | 2 weeks | |

## Implementation

* Divide the death part of the generation clock into discrete chunks, maybe at 5,6,7,8:00

## Performance

* pre-allocate all BunnyNode instances?

## PhET-iO

## Design

* Co-locate generation clock and time controls?

## Testing

* Update PhET-iO design doc for QA

## Relevant Java Code

Food:
* Bunny.getNewHopDirection, moveAround, hunger
* Famine
* NaturalSelectionModel.startFamine, endFamine, prematureEndFamine
* bunnyHungerThreshold, bunnyMaxHunger: see notes in DeveloperSettingsPanel

Wolves:
* Wolf
* Frenzy
* NaturalSelectionModel.startFrenzy, endFrenzy, prematureEndFrenzy
* bunniesPerWolves: see notes in DeveloperSettingsPanel