import React from 'react';
import styled from 'styled-components';
import { NextPage } from 'next';
import merge from 'deepmerge';
import unified from 'unified';
import remark from 'remark-parse';
import remarkToRehype from 'remark-rehype';
import rehypeToReact from 'rehype-react';
import directive from 'remark-directive';
import raw from 'rehype-raw';
import sanitize from 'rehype-sanitize';
import gh from 'hast-util-sanitize/lib/github.json';
import { directiveConverter } from '../../directives/directiveConverter';
import { IVCalculatorDirective } from '../../directives/IVCalculatorDirective';
import { RouteContext } from '../../reducers/route/reducer';
import { IVTracker } from '../../components/route/IVTracker';
import { IVDisplay } from '../../components/route/IVDisplay';

const schema = merge(gh, {
  tagNames: [
    'calculator',
  ],
  attributes: {
    calculator: ['species', 'contents', 'baseStats'],
  },
});

const processor = unified()
  .use(remark)
  .use(directive)
  .use(directiveConverter)
  .use(remarkToRehype, { allowDangerousHtml: true })
  .use(raw)
  .use(sanitize, schema)
  .use(rehypeToReact, {
    createElement: React.createElement,
    components: {
      calculator: IVCalculatorDirective,
    },
  });

const testContent = `
:::calculator{species=Lillipup baseStats="[[45, 60, 45, 25, 45, 55], [65, 80, 65, 35, 65, 60]]"}
5:
   6 -> 0, 0, 0, 1, 0, 0 # Oshawott (1 SPATK)
   7 -> 0, 0, 0, 1, 0, 0
   8 -> 0, 0, 0, 1, 0, 0
   9 -> 0, 0, 0, 1, 0, 1 # Pansage (1 SPD)
  10 -> 0, 0, 0, 1, 0, 2 # Panpour (1 SPD)
  11 -> 0, 1, 0, 1, 0, 2 # Patrat (1 ATK)
  12 -> 0, 3, 0, 1, 0, 2 # Lillipup (1 ATK), Lillipup (1 ATK)
  13 -> 0, 5, 0, 1, 0, 2 # Patrat (1 ATK), Patrat (1 ATK)
  14 -> 0, 7, 0, 1, 0, 2 # Lillipup (1 ATK), Riolu (1 ATK)
  15 -> 0, 7, 2, 1, 0, 2 # Venipede (1 DEF), Koffing (1 DEF)
  16 -> 0, 7, 3, 1, 0, 2
  17 -> 1, 7, 6, 1, 0, 2 # Koffing (1 DEF), Whirlipede (2 DEF)
  18 -> 1, 7, 6, 1, 0, 2
6:
  7 -> 1, 2, 3, 4, 5, 6
:::

:::calculator{species=Mudkip baseStats="[[50, 70, 50, 50, 50, 40]]"}
5:
  6 -> 0, 1, 0, 0, 0, 1
:::
# Test
`;

const RouteView: NextPage = () => {
  const content = processor.processSync(testContent).result as React.ReactNode;
  const state = RouteContext.useState();

  return (
    <Container>
      <Guide>
        {content}
      </Guide>
      <Sidebar>
        <TrackerInputContainer>
          {Object.values(state.trackers).map(tracker => (
            <IVTracker key={tracker.name} tracker={tracker} />
          ))}
        </TrackerInputContainer>
        <div>
          {Object.values(state.trackers).map(tracker => (
            <IVDisplay key={tracker.name} tracker={tracker} />
          ))}
        </div>
      </Sidebar>
    </Container>
  );
};

export default RouteContext.connect(RouteView);

const Container = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 1fr minmax(28rem, max-content);
  overflow: hidden;
`;

const Guide = styled.div`
  padding: 0.5rem;
  overflow-y: auto;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #222;
  color: #eee;
  overflow: hidden;
`;

const TrackerInputContainer = styled.div`
  overflow-y: auto;
  min-height: 0;
  flex-grow: 1;
  align-self: stretch;
`;
