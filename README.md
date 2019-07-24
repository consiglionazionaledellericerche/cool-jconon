<h1 align="center">
  <a href="https://github.com/consiglionazionaledellericerche/cool-jconon">
    CNR E-Recruitment
  </a>
</h1>
<p align="center">
  Online application system for recruitment of staff and other types of employment and training of the National Research Council of Italy.
</p>
<p>
The system manages all the phases of a public call, from the publication, to the presentation of the application, to arrive at the work of the commission and then to the assignment of scores and the publication of the rankings.
</p>
<p>
The system is part of the e-government project of CNR, in coherence with the Administrative Digital Code and regulations concerning optimization of the productivity of public work and of efficiency and transparency of public administrations and their simplification and development*.*27 October 2009, legislative decree, n. 150, on "Implementation of the 4 March 2009 law, n. 15, on the matter of optimization of the productivity of public work and of efficiency and transparency of public administrations" and the recent 9 February 2012 legislative decree, n. 5, "Urgent measures of simplification and development" (art. 8 Simplification of participation in recruitment competitions and testing).
</p>
<p align="center">
  <a href="https://github.com/consiglionazionaledellericerche/cool-jconon/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg" alt="Cool Jconon is released under the GNU AGPL v3 license." />
  </a>
  <a href="https://mvnrepository.com/artifact/it.cnr.si.cool.jconon/cool-jconon-parent">
    <img alt="Maven Central" src="https://img.shields.io/maven-central/v/it.cnr.si.cool.jconon/cool-jconon-parent.svg?style=flat" alt="Current version on maven central.">
  </a>
</p>

## MAVEN dependency
|Artifact| Version |
|---|---|
|[Apache Chemistry](https://chemistry.apache.org/java/opencmis.html)| ![Maven Central](https://img.shields.io/maven-central/v/org.apache.chemistry.opencmis/chemistry-opencmis-client-impl.svg)|
|[Spring Boot](https://spring.io/projects/spring-boot)| ![Maven Central with version prefix filter](https://img.shields.io/maven-central/v/org.springframework.boot/spring-boot/2.1.6.RELEASE.svg) |
|[Spring.io](https://spring.io/)| ![Maven Central with version prefix filter](https://img.shields.io/maven-central/v/org.springframework/spring-context/5.1.6.RELEASE.svg) |
|[Cool](https://github.com/consiglionazionaledellericerche/cool) | ![Maven Central](https://img.shields.io/maven-central/v/it.cnr.si.cool/cool-parent.svg)|
|[OpenCMIS Criteria](https://mvnrepository.com/artifact/it.cnr.si/opencmis-criteria) | ![Maven Central](https://img.shields.io/maven-central/v/it.cnr.si/opencmis-criteria.svg)|


## Run

#### Prerequisites Docker and docker-compose
```
git clone https://github.com/consiglionazionaledellericerche/cool-jconon.git
cd cool-jconon/docker-compose
docker-compose up -d;docker-compose logs -f
```
### Normally after 120 seconds the application responds

* [Jconon](http://localhost/)
* [Alfresco](http://localhost/alfresco)
* [Solr](http://localhost/solr4)


## 👏 How to Contribute

The main purpose of this repository is to continue evolving cool-jconon. We want to make contributing to this project as easy and transparent as possible, and we are grateful to the community for contributing bugfixes and improvements.

## 📄 License

Cool-Jconon is GNU AFFERO GENERAL PUBLIC LICENSE licensed, as found in the [LICENSE][l] file.

[l]: https://github.com/consiglionazionaledellericerche/cool-jconon/blob/master/LICENSE