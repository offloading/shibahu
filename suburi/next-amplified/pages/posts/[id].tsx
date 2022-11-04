import { Amplify, API, withSSRContext } from "aws-amplify";
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql'
import { GetStaticPaths, InferGetStaticPropsType, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { GetPostQuery, ListPostsQuery } from "../../src/API";
import awsExports from "../../src/aws-exports";
import { deletePost } from "../../src/graphql/mutations";
import { getPost, listPosts } from "../../src/graphql/queries";
import styles from "../../styles/Home.module.css";

Amplify.configure({ ...awsExports, ssr: true });

export const getStaticPaths: GetStaticPaths = async () => {
  const SSR = withSSRContext()
  const result = await SSR.API.graphql({ query: listPosts })

  const data = result.data as ListPostsQuery
  if (!data.listPosts || !data.listPosts.items) {
    throw new Error('listPosts error')
  }
  const paths = data.listPosts.items.map((post) => ({
    params: { id: post!.id },
  }))
  return {
    fallback: true,
    paths,
  }
}

type Params = {
  params: {
    id: string
  }
}

export const getStaticProps = async ({ params }: Params) => {
  const SSR = withSSRContext()
  const { id } = params
  const result = await SSR.API.graphql({
    query: getPost,
    variables: {
      id,
    },
  })

  const data = result.data as GetPostQuery
  if (data.getPost === null) {
    throw new Error('getPost error')
  }
  return {
    props: {
      post: data.getPost,
    },
  }
}

const PostComponent: NextPage<InferGetStaticPropsType<
  typeof getStaticProps
>> = (props: { post: GetPostQuery['getPost'] }) => {
  const router = useRouter()
  const { post } = props

  if (router.isFallback || !post) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Loading&hellip;</h1>
      </div>
    )
  }

  const handleDelete = async () => {
    try {
      await API.graphql({
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
        query: deletePost,
        variables: {
          input: { id: post.id },
        },
      })
      window.location.href = '/'
    } catch ({ errors }) {
      console.error(...errors)
      throw new Error(errors[0].message)
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{post.message} - Amplify + Next.js</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <p className={styles.description}>{post.message}</p>
      </main>

      <footer className={styles.footer}>
        <button onClick={handleDelete}>🚮投稿を削除する</button>
      </footer>
    </div>
  )
}

export default PostComponent
