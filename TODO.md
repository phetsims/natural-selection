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
| Proportions graph | 1.5 weeks | | 
| Population graph | 3 weeks | |
| Food | 1 week | | 
| Wolves | 1 week | |

## Implementation

* get rid of some submodels, move some Properties into view?

* Divide the death part of the generation clock into discrete chunks, maybe at 5,6,7,8:00

Food:
* with limited food, some proportion of the population dies, regardless of teeth allele
* with tough food, some portion of the population dies, but more of shortTeeth die
* with neither, no bunnies die of food-related causes
* punt on clustering around food for now

Wolves:
* number of wolves is dynamic, proportional to number of bunnies (PhetioGroup)

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