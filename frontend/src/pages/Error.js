import { useRouteError } from 'react-router-dom';
import ErrorPageContent from '../components/error/ErrorPageContent';
import BaseLayout from "./BaseLayout";

function ErrorPage() {
    const error = useRouteError();

    let title = 'An error occurred!';
    let message = 'Something went wrong!';

    if (error?.status === 500) {
        message = error.data?.message || 'Internal server error';
    } else if (error?.status === 404) {
        title = 'Not found!';
        message = 'Could not find resource or page.';
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <BaseLayout>
            <ErrorPageContent title={title} message={message} />
        </BaseLayout>
    );
}

export default ErrorPage;
