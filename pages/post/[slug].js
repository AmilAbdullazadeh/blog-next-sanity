import styles from '../../styles/Post.module.css';
import imageUrlBuilder from "@sanity/image-url";
import { useState, useEffect } from 'react';
import BlockContent from '@sanity/block-content-to-react';
import {Toolbar} from "../../components/toolbar"

export const Post = ({body, image, title}) => {
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        const imageBuilder = imageUrlBuilder({
            projectId: 'tn6yixkf',
            dataset: 'production'
        })

        setImageUrl(imageBuilder.image(image))
    }, [image])

    return (
        <div className={styles.main} >
            <Toolbar />
            <h1>{title}</h1>
            {
                imageUrl && <img className={styles.mainImage} src={imageUrl} />
            }
            <div className={styles.body}>
                <BlockContent blocks={body} />
            </div>
        </div>
    )
};

export const getServerSideProps = async pageContext => {
    const pageSlug = pageContext.query.slug;

    if (!pageSlug) {
        return {notFound: true}
    }

    const query = encodeURIComponent(`*[ _type == "post" && slug.current == "${pageSlug}" ]`);
    const url = `https://tn6yixkf.api.sanity.io/v1/data/query/production?query=${query}`;

    const result = await fetch(url).then(response => response.json());
    const post = result.result[0]
    const datas = {body: post.body, title: post.title, image: post.mainImage}

    if (!post) {
        return {notFound: true}
    } else {
        return {props: datas}
    }

}

export default Post;
