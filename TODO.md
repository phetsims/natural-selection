# TODO list for natural-selection

## Feature Milestones

| Feature | Time Remaining | Completed |
| --- | :---: | :---: |
| Modes | 0 | 4/23/2020 |
| Mating | 0 | 4/30/2020 |
| Mutations | 1 week |  |
| Intro screen | 0 | 5/7/2020 |
| Pedigree graph | 0 | 5/11/2020 |
| query parameters | 0 | 5/18/2020 |
| Proportions graph | 0 | 5/26/2020 | 
| Population graph | 2 weeks | |
| Food | 2 weeks | | 
| Wolves | 2 weeks | |
| Memory pruning | 2 weeks | |

## Implementation

* strobing of dashed plots in Population graph
* Too many Properties with 'generation' in their name is confusing
* More iteration over genes, less brute-force
* Prune dead bunnies
* Stop the sim when generation limit is hit

## Performance

## PhET-iO

## Design

* Death due to old-age is not a separate data point

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