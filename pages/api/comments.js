// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export default async function handler(req, res) {
	try {
		const token = process.env.GRAPHCMS_TOKEN;
		const graphQLClient = new GraphQLClient(graphqlAPI, {
			headers: {
				authorization: `Bearer ${token}`,
			},
		});

		const query = gql`
			mutation CreateComment(
				$name: String!
				$email: String!
				$comment: String!
				$slug: String!
			) {
				createComment(
					data: {
						name: $name
						email: $email
						comment: $comment
						post: { connect: { slug: $slug } }
					}
				) {
					id
				}
			}
		`;

		const result = await graphQLClient.request(query, {
			name: req.body.name,
			email: req.body.email,
			comment: req.body.comment,
			slug: req.body.slug,
		});

		return res.status(200).send(result);
	} catch (err) {
		console.log('comment saving err: ', err);
		return res.status(500).send(err);
	}
}
