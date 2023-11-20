# gatsby-plugin-contentful-optional-fields

**Forked from**: https://www.npmjs.com/package/gatsby-plugin-contentful-optional-fields

This package resolves an issue with gatsby-source-contentful and optional fields. When an optional field is defined on a content type in Contentful, at least one instance of that content type MUST contain an entry in that optional field. Otherwise, gatsby-source-contentful will not send that optional field in the return data, and suddenly your GraphQL queries are all borked. Uh-oh!

This package lets you manually define optional fields on each content type. When defined this way, your GraphQL queries will recieve NULL for unpopulated optional fields, instead of no value at all.

## Installation

`npm i gatsby-contentful-optional-fields`

## Quickstart

Include `gatsby-plugin-contentful-optional-fields` in your `gatsby-config.js`, with a map of optional fields and their primitive types in the plugin options.

```js
{
  resolve: 'gatsby-plugin-contentful-optional-fields',
  options: {
    optionalFields: {
      ParentNode: {
        optionalFieldName: 'String'
      }
    }
  }
}
```

## Setting up your config file

First, include `gatsby-plugin-contentful-optional-fields` in your `gatsby-config.js`.

```js
{
  resolve: 'gatsby-plugin-contentful-optional-fields',
  options: {
    optionalFields: {}
  }
}
```

Next, you must provide a config object which defines all of your optional fields. The format for this object is as follows:

```js
{
  ParentNode: {
    optionalFieldName: 'Optional field type'
  }
}
```

For instance, if your ContentfulPages have an "optionalHeader" field, which is a relational field that links to a ContentfulHeader node, your config would look like this:

```js
{
  ContentfulPage: {
    optionalHeader: 'Node'
  }
}
```

The optional field type in this case is a Node (an object with child properties). Typically, your fields will either be of type 'Node', 'String' or 'Int'.

Your final plugin object should look something like this:

```js
{
  resolve: 'gatsby-plugin-contentful-optional-fields',
  options: {
    optionalFields: {
      ContentfulPage: {
        optionalCustomHeader: 'Node'
      }
    }
  }
}
```

## Usage in GraphQL queries

Now that your config file is set up, you can begin using optional fields in your queries. For optional fields of type Node, you will have to change your queries to use the spread operator (`... on ContentType`), since child properties will not be guaranteed to exist if the optional field is not set, and therefore NULL is sent.

For instance, an optional query for a ContentfulHeader might look something like this (note the spread operator):

```
query {
  contentfulPage {
    optionalCustomHeader {
      ... on ContentfulHeader {
        id
        logo
        links
      }
    }
  }
}
```

## Advanced example

```js
{
  resolve: 'gatsby-plugin-contentful-optional-fields',
  options: {
    optionalFields: {
      ContentfulPage: {
        optionalCustomHeader: 'Node',
        optionalCustomTitle: 'String',
      },
      ContentfulBlogPost {
        optionalAuthor: 'Node',
        optionalPublishDate: 'Int'
      }
    }
  }
}
```

```
query {
  contentfulPage {
    optionalCustomHeader {
      ... on ContentfulHeader {
        id
        logo
        links
      }
    }
    optionalCustomTitle
  }
  contentfulBlogPost {
    optionalAuthor {
      ... on ContentfulAuthor {
        id
        firstName
        lastName
      }
    }
    optionalPublishDate
  }
}
```