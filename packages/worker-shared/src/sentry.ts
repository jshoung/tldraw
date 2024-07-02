import { WorkerVersionMetadata } from '@cloudflare/workers-types'
import { Toucan } from 'toucan-js'
import { requiredEnv } from './env'

interface Context {
	waitUntil: ExecutionContext['waitUntil']
	request?: Request
}

interface SentryEnvironment {
	readonly SENTRY_DSN: string | undefined
	readonly WORKER_NAME: string | undefined
	readonly CF_VERSION_METADATA: WorkerVersionMetadata
}

export function createSentry(ctx: Context, env: SentryEnvironment, request?: Request) {
	const { SENTRY_DSN, WORKER_NAME, CF_VERSION_METADATA } = requiredEnv(env, {
		SENTRY_DSN: true,
		WORKER_NAME: true,
		CF_VERSION_METADATA: true,
	})

	return new Toucan({
		dsn: SENTRY_DSN,
		release: `${WORKER_NAME}.${CF_VERSION_METADATA.id}`,
		environment: WORKER_NAME,
		context: ctx,
		request,
		requestDataOptions: {
			allowedHeaders: ['user-agent'],
			allowedSearchParams: /(.*)/,
		},
	})
}