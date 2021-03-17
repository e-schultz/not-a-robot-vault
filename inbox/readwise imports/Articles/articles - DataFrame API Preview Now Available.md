# articles - DataFrame API Preview Now Available!

- Author: Brian Hulette, Robert Bradshaw, beam.apache.org - @huletteDataFrameAPIPreview2020
- Full Title: DataFrame API Preview Now Available!
- Category: #articles #readwiseimport
- URL: https://beam.apache.org/blog/dataframe-api-preview-available/
- Cover: ![](https://readwise-assets.s3.amazonaws.com/static/images/article3.5c705a01b476.png)

### Highlights first exported March 2, 2021 at 4:51 PM

- DataFrame API Preview now Available!
- We’re excited to announce that a preview of the Beam Python SDK’s new DataFrame
  API is now available in Beam
  2.26.0. Much like SqlTransform
  (Java,
  Python),
  the DataFrame API gives Beam users a way to express complex
  relational logic much more concisely than previously possible.
- DataFrames as a DSLYou may already be aware of Beam
  SQL, which is
  a Domain-Specific Language (DSL) built with Beam’s Java SDK. SQL is
  considered a DSL because it’s possible to express a full pipeline, including IOs
  and complex operations, entirely with SQL.
- This is possible because the DataFrame API doesn’t just implement Pandas’
  computation operations, it also includes IOs based on the Pandas native
  implementations (pd.read_{csv,parquet,...} and pd.DataFrame.to_{csv,parquet,...}).
- Like SQL, it’s also possible to embed the DataFrame API into a larger pipeline
  by using
  schemas.
- It’s also possible to use the DataFrame API by passing a function to
  DataframeTransform:from apache_beam.dataframe.transforms import DataframeTransform
  with beam.Pipeline() as p:
  ...
  | beam.Select(DOLocationID=lambda line: int(..),
  passenger_count=lambda line: int(..))
  | DataframeTransform(lambda df: df.groupby('DOLocationID').sum())
  | beam.Map(lambda row: f'{row.DOLocationID},{row.passenger_count}')
  ...
- CaveatsAs hinted above, there are some differences between Beam’s DataFrame API and the
  Pandas API. The most significant difference is that the Beam DataFrame API is
  deferred, just like the rest of the Beam API. This means that you can’t
  print() a DataFrame instance in order to inspect the data, because we haven’t
  computed the data yet!
