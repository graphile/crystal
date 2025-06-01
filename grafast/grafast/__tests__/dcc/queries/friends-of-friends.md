This test is an extension of the friends test - returning the friends of a
friend. A friend can be an ActiveCrawler or an NPC - and NPC is a polymorphic
type which can lead to the nodes in the plan combining when appropriate.

```mermaid
  graph TD

  Id --> IsCrawler
  Id --> IsNPC

  subgraph Crawler
  IsCrawler --> LoadCrawler
  LoadCrawler --> GetTypeNameFromCrawler
  LoadCrawler --> ActiveCrawler
  LoadCrawler --> DeletedCrawler
  end

  subgraph NPC
  IsNPC --> LoadNPC
  LoadNPC --> GetTypeNameFromNPC
  LoadNPC --> Manager & Security & Staff & Guide
  end

  GetTypeNameFromCrawler & GetTypeNameFromNPC --> Coalesce
  Coalesce --> $__typename

  ActiveCrawler & Manager & Security & Staff & Guide --> Combine

  Combine --> ExtractNpcById & ExtractCrawlerTypeName

  ExtractNpcById & ExtractCrawlerTypeName --> Coalesce_2
  Coalesce_2 --> $__typename_2
```
