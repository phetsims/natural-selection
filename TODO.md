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
| Proportions graph | 2 weeks | | 
| Population graph | 3 weeks | |
| Wolves | 1 week | |
| Food | 1 week | | 

## Implementation

* get rid of some submodels, move some Properties into view?

## Performance

* pre-allocate all BunnyNode instances?

## PhET-iO

## Design

* Co-locate generation clock and time controls?

## Testing

* Update PhET-iO design doc for QA

## Relevant Java Code

Food:
- Bunny.getNewHopDirection, moveAround, hunger
- Famine
- NaturalSelectionModel.startFamine, endFamine, prematureEndFamine

Wolves:
- Wolf
- Frenzy
- NaturalSelectionModel.startFrenzy, endFrenzy, prematureEndFrenzy